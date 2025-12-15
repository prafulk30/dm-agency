pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                echo 'Checking out dm-agency source code'
                checkout scm
            }
        }

        stage('Basic Verification') {
            steps {
                echo 'Pipeline is running successfully'
                sh 'node -v || echo "Node not installed yet"'
            }
        }

        stage('Basic Verification 2 - Intentional Failure') {
           steps {
                echo 'Intentionally breaking the pipeline'
                sh 'node -v'
            }
        }

    }
}
