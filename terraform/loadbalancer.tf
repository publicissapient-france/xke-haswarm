# Security group
resource "aws_security_group" "lb-admin" {
  name = "${var.project}-sg lb-admin"

  tags {
    Name = "${var.project}-sg lb-admin"
    Project = "${var.project}"
  }

}

resource "aws_security_group_rule" "allow_lb_swarm" {
  type = "ingress"
  from_port = 0
  to_port = 0
  protocol = "-1"
  cidr_blocks = [
    "0.0.0.0/0"]
  security_group_id = "${aws_security_group.lb-admin.id}"
  //    source_security_group_id = "${aws_elb.admin.source_security_group_id}"
}

resource "aws_security_group_rule" "lb_swarm_out" {
  type = "egress"
  from_port = 0
  to_port = 0
  protocol = "-1"
  cidr_blocks = [
    "0.0.0.0/0"]
  security_group_id = "${aws_security_group.lb-admin.id}"
  //  source_security_group_id = "${aws_elb.admin.source_security_group_id}"
}

resource "aws_elb" "admin" {
  name = "${var.project}-lb-admin"
  # The same availability zone as our instance
  availability_zones = [
    "${element(aws_instance.master.*.availability_zone, count.index)}"]
  listener {
    instance_port = 3375
    instance_protocol = "tcp"
    lb_port = 3375
    lb_protocol = "tcp"
  }
  security_groups = [
    "${aws_security_group.lb-admin.id}"]
  instances = [
    "${aws_instance.master.*.id}"]
}

resource "aws_elb" "https" {
  name = "${var.project}-lb-https"
  # The same availability zone as our instance
  availability_zones = [
    "${element(aws_instance.node.*.availability_zone, count.index)}"]
  listener {
    instance_port = 80
    instance_protocol = "http"
    lb_port = 80
    lb_protocol = "http"
  }
  instances = [
    "${aws_instance.node.*.id}"]
}

resource "aws_route53_record" "lb-record-admin" {
    name = "admin.${var.domain_name}"
    zone_id = "${var.zone_id}"
    type = "CNAME"
    records = ["${aws_elb.admin.dns_name}"]
    ttl = "1"
}

resource "aws_route53_record" "lb-record-https" {
  name = "*.service.${var.domain_name}"
  zone_id = "${var.zone_id}"
  type = "CNAME"
  records = ["${aws_elb.https.dns_name}"]
  ttl = "1"
}