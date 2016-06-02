resource "aws_security_group" "default" {
  name = "${var.project}-sg"
  description = "${var.project} security group"
  ingress {
    from_port = 22
    to_port = 22
    protocol = "tcp"
    cidr_blocks = [
      "0.0.0.0/0"]
  }

  ingress {
    from_port = 3375
    to_port = 3375
    protocol = "tcp"
    cidr_blocks = [
      "0.0.0.0/0"]
  }


  ingress {
    from_port = 3375
    to_port = 3375
    protocol = "udp"
    cidr_blocks = [
      "0.0.0.0/0"]
  }

  ingress {
    from_port = 0
    to_port = 0
    protocol = "icmp"
    cidr_blocks = [
      "0.0.0.0/0"]
  }

  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = [
      "0.0.0.0/0"]
  }

  ingress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = [
      "${aws_subnet.default.cidr_block}"]
  }

  tags {
    Name = "${var.project}-sg default"
  }

}


resource "aws_security_group" "master" {
  name = "${var.project}-sg master"
}

resource "aws_security_group_rule" "allow_swarm" {
  type = "ingress"
  from_port = 0
  to_port = 0
  protocol = "tcp"
  cidr_blocks = ["0.0.0.0/0"]
  security_group_id = "${aws_security_group.master.id}"
//  source_security_group_id = "${aws_elb.admin.source_security_group_id}"
}

//resource "aws_security_group_rule" "allow_ssh" {
//  type = "ingress"
//  from_port = 22
//  to_port = 22
//  protocol = "tcp"
//  security_group_id = "${aws_security_group.default.id}"
//}


