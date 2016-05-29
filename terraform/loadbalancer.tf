# Security group
resource "aws_security_group" "lb-admin" {
  name = "${var.project}-sg lb-admin"

  tags {
    Name = "${var.project}-sg lb-admin"
    Project = "${var.project}"
  }

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
    "${element(aws_instance.master.*.availability_zone, count.index)}"]
  listener {
    instance_port = 80
    instance_protocol = "http"
    lb_port = 80
    lb_protocol = "http"
  }
  instances = [
    "${aws_instance.master.*.id}"]
}
