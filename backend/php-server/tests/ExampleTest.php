<?php

use PHPUnit\Framework\TestCase;

class ClientProfileTest extends TestCase
{
    public function testLogin()
    {
        $api_key = $_ENV['API_KEY'];
        $username = $_ENV['API_EMAIL'];
        $password = $_ENV['API_PASSWORD'];
    }

    public function testClientProfile()
    {
        // Mock the $_SERVER and $_POST superglobals
        $_SERVER['HTTP_ORIGIN'] = 'http://localhost:3000';
        $_POST['id'] = 1;
    
        // Mock the environment variables
        $_ENV['FRONT_HOST'] = 'http://localhost:3000';
    
        // Mock the database connection and functions
        $pdo = $this->createMock(PDO::class);
        $stm = $this->createMock(PDOStatement::class);
    
        $pdo->method('prepare')->willReturn($stm);
        $stm->method('execute')->willReturn(true);
        $stm->method('fetch')->willReturn([
            "id" => 1,
            "id_coach" => 1,
            "name" => "John",
            "surname" => "Doe",
            "email" => "john.doe@example.com",
            "address" => "123 Main St"
        ]);
        $stm->method('fetchAll')->willReturn([]);
    
        // Start output buffering
        ob_start();
        include __DIR__ . '/../client_profile.php';
        $output = ob_get_clean();
    
        // Assert the output
        $this->assertJson($output);
        $response = json_decode($output, true);
        $this->assertTrue($response['status']);
        $this->assertEquals(1, $response['data']['id']);
    }
}