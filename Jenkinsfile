pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out dm-agency repository'
                checkout scm
            }
        }

        stage('Sanity Check') {
            steps {
                echo 'CI pipeline is running successfully'
                sh 'echo Hello from Jenkins'
            }
        }
    }
}
