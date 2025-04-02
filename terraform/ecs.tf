resource "aws_ecs_task_definition" "product_task" {
  family             = "product-task"
  requires_compatibilities = ["FARGATE"]
  memory             = "512"
  cpu                = "256"
  execution_role_arn = aws_iam_role.ecs_task_execution_role.arn
  network_mode       = "awsvpc"

  container_definitions = jsonencode([
    {
      name      = "product-api"
      image     = "123456789.dkr.ecr.us-east-1.amazonaws.com/product-api:latest"
      cpu       = 256
      memory    = 512
      essential = true
      environment = [
        {
          name  = "DATABASE_URL",
          value = module.rds.db_endpoint
        }
      ]
      secrets = [
        {
          name      = "DB_PASSWORD",
          valueFrom = aws_secretsmanager_secret.db_credentials.arn
        }
      ]
    }
  ])
}

resource "aws_ecs_service" "product_service" {
  name            = "product-service"
  cluster         = aws_ecs_cluster.product_api.id
  task_definition = aws_ecs_task_definition.product_task.arn
  desired_count   = 2
  launch_type     = "FARGATE"

  network_configuration {
    subnets = ["subnet-xxxxxxxx", "subnet-yyyyyyyy"]
    security_groups = [aws_security_group.ecs_sg.id]
    assign_public_ip = true
  }
}
