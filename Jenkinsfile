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
                sh 'docker build -t dm-agency:${BRANCH_NAME} .'
            }
        }

        stage('Deploy to Staging') {
            when {
                branch 'develop'
            }
            steps {
                sh '''
                  docker stop dm-agency-staging || true
                  docker rm dm-agency-staging || true
                  docker run -d \
                    --name dm-agency-staging \
                    -p 8081:80 \
                    dm-agency:develop
                '''
            }
        }

        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                sh '''
                  docker stop dm-agency-prod || true
                  docker rm dm-agency-prod || true
                  docker run -d \
                    --name dm-agency-prod \
                    -p 80:80 \
                    dm-agency:main
                '''
            }
        }
    }
}
