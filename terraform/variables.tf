variable "access_key" {
  type = "string"
}

variable "secret_key" {
  type = "string"
}

variable "master_count" {
  type    = "string"
  default = "3"
}

variable "node_count" {
  type    = "string"
  default = "7"
}


variable "aws_region" {
  type    = "string"
  default = "eu-central-1"
}

variable "key_name" {
  type    = "string"
  default = "xke-ha-swarm"
}

variable "key_path" {
  type    = "string"
  default = "xke-ha-swarm"
}

variable "aws_amis" {
  type = "map"

  default = {
    eu-central-1 = "ami-f9e30f96"
  }
}

variable "project" {
  type    = "string"
  default = "xke-ha-swarm"
}
