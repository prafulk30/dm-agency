pipeline {
    agent any

    environment {
        IMAGE_NAME = "dm-agency"
        IMAGE_TAG  = "${GIT_COMMIT}"
        PREV_IMAGE_FILE = "/var/jenkins_home/prev_prod_image.txt"
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

        stage('Deploy to Production') {
            when { branch 'main' }
            steps {
                sh '''
                  # Save currently running prod image (if exists)
                  if docker ps --format '{{.Names}}' | grep -q dm-agency-prod; then
                    docker inspect dm-agency-prod --format='{{.Config.Image}}' > $PREV_IMAGE_FILE
                  fi

                  docker stop dm-agency-prod || true
                  docker rm dm-agency-prod || true

                  docker run -d \
                    --name dm-agency-prod \
                    -p 80:80 \
                    $IMAGE_NAME:$IMAGE_TAG
                '''
            }
        }

        stage('Health Check (Production)') {
            when { branch 'main' }
            steps {
                sh '''
                  sleep 10
                  curl -f http://localhost || exit 1
                '''
            }
        }
    }

    post {
        failure {
            script {
                if (env.BRANCH_NAME == 'main') {
                    sh '''
                      echo "Deployment failed. Rolling back..."

                      if [ -f $PREV_IMAGE_FILE ]; then
                        PREV_IMAGE=$(cat $PREV_IMAGE_FILE)

                        docker stop dm-agency-prod || true
                        docker rm dm-agency-prod || true

                        docker run -d \
                          --name dm-agency-prod \
                          -p 80:80 \
                          $PREV_IMAGE
                      else
                        echo "No previous image found. Rollback skipped."
                      fi
                    '''
                }
            }
        }
    }
}
