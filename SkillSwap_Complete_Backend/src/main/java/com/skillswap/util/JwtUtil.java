package com.skillswap.util;

import org.springframework.util.StringUtils;

public final class JwtUtil {

    private JwtUtil() {}

    public static String extractBearerToken(String authorizationHeader) {
        if (StringUtils.hasText(authorizationHeader) && authorizationHeader.startsWith("Bearer ")) {
            return authorizationHeader.substring(7).trim();
        }
        return null;
    }
}
