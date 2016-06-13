variable "master_count" {
  type = "string"
  default = "3"
}

variable "node_count" {
  type = "string"
  default = "7"
}


variable "aws_region" {
  type = "string"
  default = "eu-central-1"
}

variable "key_name" {
  type = "string"
  default = "xke-ha-swarm"
}

variable "aws_amis" {
  type = "map"

  default = {
//    eu-central-1 = "ami-8d21cee2"
    eu-central-1 = "ami-60eb020f"
  }
}

variable "project" {
  type = "string"
  default = "xke-ha-swarm"
}

variable "vpc_id" {
  type = "string"
}

variable "private_subnet" {
  type = "string"
}