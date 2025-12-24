package com.night.admin.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 会话信息 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SessionInfoDTO {
    private String username;
    private Long activeTokenCount;
}
