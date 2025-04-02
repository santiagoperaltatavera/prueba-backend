resource "aws_db_instance" "postgres" {
  identifier          = "product-db"
  engine              = "postgres"
  instance_class      = "db.t3.micro"
  allocated_storage   = 20
  storage_encrypted   = true
  username            = jsondecode(aws_secretsmanager_secret_version.db_credentials_version.secret_string)["username"]
  password            = jsondecode(aws_secretsmanager_secret_version.db_credentials_version.secret_string)["password"]
  publicly_accessible = false
  skip_final_snapshot = true
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
}
