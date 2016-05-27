provider "aws" {
  access_key = "${var.access_key}"
  secret_key = "${var.secret_key}"
  region     = "${var.aws_region}"
}

# Security group
resource "aws_security_group" "default" {
  name        = "${var.project}-sg"
  description = "${var.project} security group"

  # SSH access from anywhere
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

}



resource "aws_key_pair" "deployer" {
  key_name   = "${var.key_name}"
  public_key = "${file("${var.key_name}.pub")}"
}

resource "aws_instance" "master" {
  count         = "${var.master_count}"
  key_name      = "${var.key_name}"
  ami           = "${lookup(var.aws_amis, var.aws_region)}"
  instance_type = "m3.large"

  tags {
    Name    = "${var.project}-master-${count.index + 1}"
    Project = "${var.project}"
    Owner    = "tauffredou@xebia.fr"
  }

  security_groups = ["${aws_security_group.default.name}"]
}

resource "aws_instance" "node" {
  count         = "${var.node_count}"
  key_name      = "${var.key_name}"
  ami           = "${lookup(var.aws_amis, var.aws_region)}"
  instance_type = "m3.large"

  tags {
    Name    = "${var.project}-node-${count.index + 1}"
    Project = "${var.project}"
    Owner    = "tauffredou@xebia.fr"
  }

  security_groups = ["${aws_security_group.default.name}"]
}
