package com.night.admin.application.service;

import com.night.admin.domain.user.UserService;
import com.night.admin.domain.user.entity.User;
import com.night.admin.domain.user.repository.UserRepository;
import com.night.admin.domain.user.specification.UserSpecification;
import com.night.admin.application.dto.response.UserResponseDTO;
import com.night.admin.application.dto.request.CreateUserRequestDTO;
import com.night.admin.application.dto.request.UpdateUserRequestDTO;
import com.night.admin.application.dto.request.SearchUserRequestDTO;
import com.night.admin.application.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserApplicationService {
    
    private final UserService userService;
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    
    @Transactional(readOnly = true)
    public UserResponseDTO getUserById(Long id) {
        User user = userService.getUserById(id);
        if (user != null) {
            return userMapper.toResponseDTO(user);
        }
        throw new RuntimeException("User not found");
    }
    
    @Transactional
    public UserResponseDTO createUser(CreateUserRequestDTO request) {
        User user = userMapper.toDomain(request);
        User savedUser = userService.save(user);
        return userMapper.toResponseDTO(savedUser);
    }
    
    /**
     * 更新用户
     * 
     * @param id 用户ID
     * @param request 更新请求（所有字段均为可选）
     * @return 更新后的用户响应DTO
     */
    @Transactional
    public UserResponseDTO updateUser(Long id, UpdateUserRequestDTO request) {
        log.info("更新用户: userId={}, request={}", id, request);
        
        // 将 DTO 转换为 Domain 对象
        User updateData = userMapper.toDomain(request);
        
        // 调用领域服务执行更新逻辑
        User updatedUser = userService.updateUser(id, updateData);
        
        // 转换为 ResponseDTO 返回
        return userMapper.toResponseDTO(updatedUser);
    }
    
    /**
     * 删除用户
     * 
     * @param id 用户ID
     */
    @Transactional
    public void deleteUser(Long id) {
        log.info("删除用户: userId={}", id);
        userService.deleteUser(id);
        log.info("用户删除成功: userId={}", id);
    }
    
    /**
     * 搜索用户（支持可选条件）
     * 
     * @param request 搜索条件（所有字段均为可选）
     * @param pageable 分页参数
     * @return 分页用户列表
     */
    @Transactional(readOnly = true)
    public Page<UserResponseDTO> searchUsers(SearchUserRequestDTO request, Pageable pageable) {
        log.info("搜索用户: username={}, email={}, isActive={}", 
            request.getUsername(), request.getEmail(), request.getIsActive());
        
        // 使用 Specification 构建动态查询条件
        Specification<User> spec = UserSpecification.buildSearchCriteria(
            request.getUsername(), 
            request.getEmail(), 
            request.getIsActive()
        );
        
        // 执行分页查询
        Page<User> users = userRepository.findAll(spec, pageable);
        
        // 转换为 ResponseDTO
        return users.map(userMapper::toResponseDTO);
    }
    
    /**
     * 搜索用户（不分页，返回所有匹配结果）
     * 
     * @param request 搜索条件
     * @return 用户列表
     */
    @Transactional(readOnly = true)
    public List<UserResponseDTO> searchUsers(SearchUserRequestDTO request) {
        log.info("搜索用户（不分页）: username={}, email={}, isActive={}", 
            request.getUsername(), request.getEmail(), request.getIsActive());
        
        Specification<User> spec = UserSpecification.buildSearchCriteria(
            request.getUsername(), 
            request.getEmail(), 
            request.getIsActive()
        );
        
        List<User> users = userRepository.findAll(spec);
        
        return users.stream()
            .map(userMapper::toResponseDTO)
            .collect(Collectors.toList());
    }
}