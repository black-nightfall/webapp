package com.night.admin.util;

import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Component;

/**
 * 国际化消息服务
 */
@Component
@RequiredArgsConstructor
public class MessageService {

    private final MessageSource messageSource;

    /**
     * 获取国际化消息
     *
     * @param code 消息代码
     * @return 国际化消息
     */
    public String getMessage(String code) {
        return getMessage(code, null);
    }

    /**
     * 获取国际化消息（带参数）
     *
     * @param code 消息代码
     * @param args 参数数组
     * @return 国际化消息
     */
    public String getMessage(String code, Object[] args) {
        return messageSource.getMessage(code, args, LocaleContextHolder.getLocale());
    }

    /**
     * 获取国际化消息（带默认值）
     *
     * @param code           消息代码
     * @param args           参数数组
     * @param defaultMessage 默认消息
     * @return 国际化消息
     */
    public String getMessage(String code, Object[] args, String defaultMessage) {
        return messageSource.getMessage(code, args, defaultMessage, LocaleContextHolder.getLocale());
    }
}
