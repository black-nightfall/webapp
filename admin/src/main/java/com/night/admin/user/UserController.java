package com.night.admin.user;

import com.night.admin.common.dto.Result;
import com.night.admin.user.dto.UserDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    
    /**
     * 获取所有用户
     */
    @GetMapping
    public Result<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        return Result.success(users);
    }
    
    /**
     * 根据ID获取用户
     */
    @GetMapping("/{id}")
    public Result<UserDTO> getUser(@PathVariable Long id) {
        UserDTO user = userService.getUser(id);
        return Result.success(user);
    }
}
