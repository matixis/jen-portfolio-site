terraform {
  required_version = ">= 1.6"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Same state bucket the other thenilans/atxstump/feesmash sites use.
  backend "s3" {
    bucket       = "matixis-tfstate"
    key          = "jen-portfolio/site.tfstate"
    region       = "us-east-2"
    use_lockfile = true
    encrypt      = true
  }
}

# CloudFront requires its ACM cert in us-east-1, so keep everything there.
provider "aws" {
  region = "us-east-1"

  default_tags {
    tags = {
      Project   = "jen-portfolio"
      ManagedBy = "terraform"
    }
  }
}

variable "root_domain" {
  description = "Hosted zone that already exists in this account."
  type        = string
  default     = "thenilans.com"
}

variable "subdomain" {
  description = "Host label for the site under root_domain."
  type        = string
  default     = "jen"
}

locals {
  domain   = "${var.subdomain}.${var.root_domain}"
  site_dir = "${path.module}/../web/dist"
  # Vite output. Build first: (cd web && npm run build)
  site_files = fileset(local.site_dir, "**")

  content_types = {
    html        = "text/html; charset=utf-8"
    css         = "text/css; charset=utf-8"
    js          = "text/javascript; charset=utf-8"
    mjs         = "text/javascript; charset=utf-8"
    json        = "application/json"
    webmanifest = "application/manifest+json"
    xml         = "application/xml"
    txt         = "text/plain; charset=utf-8"
    svg         = "image/svg+xml"
    png         = "image/png"
    jpg         = "image/jpeg"
    jpeg        = "image/jpeg"
    webp        = "image/webp"
    avif        = "image/avif"
    ico         = "image/x-icon"
    woff        = "font/woff"
    woff2       = "font/woff2"
    pdf         = "application/pdf"
    map         = "application/json"
  }
}

# --- DNS (existing zone) -----------------------------------------------------

data "aws_route53_zone" "root" {
  name         = var.root_domain
  private_zone = false
}

# --- S3 (private, CloudFront-only access) ------------------------------------

resource "aws_s3_bucket" "site" {
  bucket = "${var.subdomain}-${replace(var.root_domain, ".", "-")}-site"
}

resource "aws_s3_bucket_public_access_block" "site" {
  bucket                  = aws_s3_bucket.site.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_versioning" "site" {
  bucket = aws_s3_bucket.site.id
  versioning_configuration {
    status = "Suspended"
  }
}

# Vite content-hashes everything under assets/, so those are immutable.
# index.html and the public/ files (screenshots, resume) keep a short TTL so a
# redeploy shows up within minutes without an invalidation.
resource "aws_s3_object" "site" {
  for_each = local.site_files

  bucket       = aws_s3_bucket.site.id
  key          = each.value
  source       = "${local.site_dir}/${each.value}"
  etag         = filemd5("${local.site_dir}/${each.value}")
  content_type = lookup(local.content_types, lower(regex("[^.]+$", each.value)), "application/octet-stream")
  cache_control = (
    startswith(each.value, "assets/") ? "public, max-age=31536000, immutable" :
    endswith(each.value, ".html") ? "public, max-age=300" :
    "public, max-age=86400"
  )
}

# --- TLS cert ----------------------------------------------------------------

resource "aws_acm_certificate" "site" {
  domain_name       = local.domain
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.site.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  zone_id         = data.aws_route53_zone.root.zone_id
  name            = each.value.name
  type            = each.value.type
  records         = [each.value.record]
  ttl             = 60
  allow_overwrite = true
}

resource "aws_acm_certificate_validation" "site" {
  certificate_arn         = aws_acm_certificate.site.arn
  validation_record_fqdns = [for r in aws_route53_record.cert_validation : r.fqdn]
}

# --- CloudFront --------------------------------------------------------------

resource "aws_cloudfront_origin_access_control" "site" {
  name                              = "${local.domain}-oac"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# Security headers on every response.
resource "aws_cloudfront_response_headers_policy" "site" {
  name = "${var.subdomain}-${replace(var.root_domain, ".", "-")}-headers"

  security_headers_config {
    strict_transport_security {
      access_control_max_age_sec = 63072000
      include_subdomains         = false
      preload                    = false
      override                   = true
    }
    content_type_options { override = true }
    frame_options {
      frame_option = "DENY"
      override     = true
    }
    referrer_policy {
      referrer_policy = "strict-origin-when-cross-origin"
      override        = true
    }
  }
}

resource "aws_cloudfront_distribution" "site" {
  enabled             = true
  is_ipv6_enabled     = true
  http_version        = "http2and3"
  default_root_object = "index.html"
  aliases             = [local.domain]
  price_class         = "PriceClass_100"
  comment             = local.domain

  origin {
    domain_name              = aws_s3_bucket.site.bucket_regional_domain_name
    origin_id                = "s3-site"
    origin_access_control_id = aws_cloudfront_origin_access_control.site.id
  }

  default_cache_behavior {
    target_origin_id           = "s3-site"
    viewer_protocol_policy     = "redirect-to-https"
    allowed_methods            = ["GET", "HEAD", "OPTIONS"]
    cached_methods             = ["GET", "HEAD"]
    cache_policy_id            = "658327ea-f89d-4fab-a63d-7e88639e58f6" # Managed-CachingOptimized
    response_headers_policy_id = aws_cloudfront_response_headers_policy.site.id
    compress                   = true
  }

  # Single-page app: unknown paths (and S3's 403 for missing keys, since the
  # OAC has no s3:ListBucket) fall through to index.html.
  dynamic "custom_error_response" {
    for_each = [403, 404]
    content {
      error_code            = custom_error_response.value
      response_code         = 200
      response_page_path    = "/index.html"
      error_caching_min_ttl = 60
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate_validation.site.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }
}

data "aws_iam_policy_document" "site" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.site.arn}/*"]

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.site.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "site" {
  bucket = aws_s3_bucket.site.id
  policy = data.aws_iam_policy_document.site.json

  depends_on = [aws_s3_bucket_public_access_block.site]
}

# --- DNS records -------------------------------------------------------------

resource "aws_route53_record" "a" {
  zone_id = data.aws_route53_zone.root.zone_id
  name    = local.domain
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.site.domain_name
    zone_id                = aws_cloudfront_distribution.site.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "aaaa" {
  zone_id = data.aws_route53_zone.root.zone_id
  name    = local.domain
  type    = "AAAA"

  alias {
    name                   = aws_cloudfront_distribution.site.domain_name
    zone_id                = aws_cloudfront_distribution.site.hosted_zone_id
    evaluate_target_health = false
  }
}

# --- Outputs -----------------------------------------------------------------

output "site_url" {
  value = "https://${local.domain}"
}

output "bucket" {
  value = aws_s3_bucket.site.id
}

output "distribution_id" {
  description = "Use for a manual invalidation: aws cloudfront create-invalidation --distribution-id <id> --paths '/*'"
  value       = aws_cloudfront_distribution.site.id
}

output "cloudfront_domain" {
  value = aws_cloudfront_distribution.site.domain_name
}
