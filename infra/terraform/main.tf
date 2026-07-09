provider "google" {
  project = "wc-2026-aura"
  region  = "us-east1"
}

resource "google_compute_network" "vpc_network" {
  name = "aura-stadium-vpc"
}
