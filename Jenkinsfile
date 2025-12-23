pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out dm-agency repository'
                checkout scm
            }
        }

        stage('Docker Build') {
            steps {
                echo 'Building Docker image for dm-agency'
                sh '''
                  docker build -t dm-agency:latest .
                '''
            }
        }

    }
}
