pipeline {
    agent any

    environment {
        IMAGE_NAME = "dm-agency"
        IMAGE_TAG  = "${GIT_COMMIT}"
        ACTIVE_COLOR_FILE = "/var/jenkins_home/active_color.txt"
        NGINX_CONF = "/var/jenkins_home/nginx.conf"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Docker Build') {
            steps {
                sh '''
                  docker build -t $IMAGE_NAME:$IMAGE_TAG .
                  docker tag $IMAGE_NAME:$IMAGE_TAG $IMAGE_NAME:latest
                '''
            }
        }

        stage('Deploy to Staging') {
            when { branch 'develop' }
            steps {
                sh '''
                  docker stop dm-agency-staging || true
                  docker rm dm-agency-staging || true
                  docker run -d \
                    --name dm-agency-staging \
                    -p 8081:80 \
                    $IMAGE_NAME:$IMAGE_TAG
                '''
            }
        }

        stage('Deploy to Production (Blue–Green)') {
            when { branch 'main' }
            steps {
                sh '''
                  # Determine active color
                  if [ ! -f $ACTIVE_COLOR_FILE ]; then
                    echo "blue" > $ACTIVE_COLOR_FILE
                  fi

                  ACTIVE_COLOR=$(cat $ACTIVE_COLOR_FILE)

                  if [ "$ACTIVE_COLOR" = "blue" ]; then
                    NEW_COLOR="green"
                  else
                    NEW_COLOR="blue"
                  fi

                  echo "Active color: $ACTIVE_COLOR"
                  echo "Deploying to: $NEW_COLOR"

                  docker stop dm-agency-prod-$NEW_COLOR || true
                  docker rm dm-agency-prod-$NEW_COLOR || true

                  docker run -d \
                    --name dm-agency-prod-$NEW_COLOR \
                    $IMAGE_NAME:$IMAGE_TAG

                  echo "$NEW_COLOR" > /tmp/new_color.txt
                '''
            }
        }

        stage('Health Check (New Color)') {
            when { branch 'main' }
            steps {
                sh '''
                  NEW_COLOR=$(cat /tmp/new_color.txt)
                  sleep 10
                  docker exec dm-agency-prod-$NEW_COLOR curl -f http://localhost || exit 1
                '''
            }
        }

        stage('Switch Traffic') {
            when { branch 'main' }
            steps {
                sh '''
                  NEW_COLOR=$(cat /tmp/new_color.txt)

                  cat > $NGINX_CONF <<EOF
upstream dm_agency_app {
    server dm-agency-prod-$NEW_COLOR:80;
}

server {
    listen 80;
    location / {
        proxy_pass http://dm_agency_app;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
EOF

                  docker exec dm-agency-nginx nginx -s reload

                  echo "$NEW_COLOR" > $ACTIVE_COLOR_FILE
                  echo "Traffic switched to $NEW_COLOR"
                '''
            }
        }
    }
}
