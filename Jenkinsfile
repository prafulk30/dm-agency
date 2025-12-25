pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t dm-agency:latest .'
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                  docker stop dm-agency-web || true
                  docker rm dm-agency-web || true
                  docker run -d \
                    --name dm-agency-web \
                    -p 80:80 \
                    dm-agency:latest
                '''
            }
        }
    }
}
