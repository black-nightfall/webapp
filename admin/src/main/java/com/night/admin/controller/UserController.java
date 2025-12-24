package com.night.admin.controller;

import com.night.common.dto.ApiResponse;
import com.night.common.exception.ResourceNotFoundException;
import com.night.common.exception.InvalidArgumentException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @GetMapping("/{id}")
    public ApiResponse<UserDTO> getUser(@PathVariable Long id) {
        if (id <= 0) {
            throw new InvalidArgumentException("User ID must be greater than 0");
        }

        UserDTO user = new UserDTO(id, "Zhang San", "zhangsan@example.com");
        return ApiResponse.success(user, "User retrieved successfully");
    }

    @PostMapping
    public ApiResponse<Void> createUser(@RequestBody CreateUserRequest request) {
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new InvalidArgumentException("Username cannot be empty");
        }

        System.out.println("User " + request.getName() + " has been created");

        return ApiResponse.success("User created successfully");
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteUser(@PathVariable Long id) {
        if (id == 999) {
            throw new ResourceNotFoundException("User ID: " + id + " does not exist");
        }

        System.out.println("User " + id + " has been deleted");
        return ApiResponse.success("User deleted successfully");
    }

    @PutMapping("/{id}")
    public ApiResponse<UserDTO> updateUser(@PathVariable Long id, @RequestBody UpdateUserRequest request) {
        if (request.getEmail() != null && !request.getEmail().contains("@")) {
            return ApiResponse.error("INVALID_EMAIL", "Email format is incorrect");
        }

        UserDTO user = new UserDTO(id, request.getName(), request.getEmail());
        return ApiResponse.success(user, "User updated successfully");
    }

    public static class UserDTO {
        private Long id;
        private String name;
        private String email;

        public UserDTO(Long id, String name, String email) {
            this.id = id;
            this.name = name;
            this.email = email;
        }

        public Long getId() { return id; }
        public String getName() { return name; }
        public String getEmail() { return email; }
    }

    public static class CreateUserRequest {
        private String name;
        private String email;

        public CreateUserRequest() {}
        public CreateUserRequest(String name, String email) {
            this.name = name;
            this.email = email;
        }

        public String getName() { return name; }
        public String getEmail() { return email; }
        public void setName(String name) { this.name = name; }
        public void setEmail(String email) { this.email = email; }
    }

    public static class UpdateUserRequest {
        private String name;
        private String email;

        public UpdateUserRequest() {}
        public UpdateUserRequest(String name, String email) {
            this.name = name;
            this.email = email;
        }

        public String getName() { return name; }
        public String getEmail() { return email; }
        public void setName(String name) { this.name = name; }
        public void setEmail(String email) { this.email = email; }
    }
}

