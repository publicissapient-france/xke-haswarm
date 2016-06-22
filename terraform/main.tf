provider "aws" {
  region = "${var.aws_region}"
}

resource "aws_subnet" "default" {
  vpc_id = "${var.vpc_id}"
  cidr_block = "${var.private_subnet}"
  map_public_ip_on_launch = "true"

  tags {
    Name = "${var.project} subnet"
    Project = "${var.project}"
  }
}

# Security group
resource "aws_key_pair" "default" {
  key_name = "${var.key_name}"
  public_key = "${file("${var.key_name}.pub")}"
}

resource "aws_instance" "master" {
  count = "${var.master_count}"
  key_name = "${var.key_name}"
  ami = "${lookup(var.aws_amis, var.aws_region)}"
  instance_type = "t2.medium"
  subnet_id = "${aws_subnet.default.id}"

  vpc_security_group_ids = [
    "${aws_security_group.default.id}",
    "${aws_security_group.master.id}"
  ]

  tags {
    Name = "${var.project}-master-${count.index + 1}"
    Project = "${var.project}"
    Owner = "${var.owner}"
  }
}

resource "aws_route53_record" "master-record" {
  count = "${var.master_count}"
  name = "master${count.index + 1}.${var.domain_name}"
  zone_id = "${var.zone_id}"
  type = "CNAME"
  records = ["${element(aws_instance.master.*.public_ip, count.index)}"]
  ttl = "1"
}

resource "aws_instance" "node" {
  count = "${var.node_count}"
  key_name = "${var.key_name}"
  ami = "${lookup(var.aws_amis, var.aws_region)}"
  instance_type = "t2.medium"
  vpc_security_group_ids = ["${aws_security_group.default.id}"]
  subnet_id = "${aws_subnet.default.id}"

  tags {
    Name = "${var.project}-node-${count.index + 1}"
    Project = "${var.project}"
    Owner = "${var.owner}"
  }
}

resource "aws_route53_record" "slave-record" {
  count = "${var.node_count}"
  name = "node${count.index + 1}.${var.domain_name}"
  zone_id = "${var.zone_id}"
  type = "CNAME"
  records = ["${element(aws_instance.node.*.public_ip, count.index)}"]
  ttl = "1"
}