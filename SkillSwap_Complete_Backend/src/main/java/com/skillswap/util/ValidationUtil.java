package com.skillswap.util;

import com.skillswap.exception.BadRequestException;

public final class ValidationUtil {

    private ValidationUtil() {}

    public static String normalizeSkillName(String rawName) {
        if (rawName == null || rawName.isBlank()) {
            throw new BadRequestException("Skill name must not be blank");
        }
        String cleaned = rawName.trim().replaceAll("\\s+", " ");
        if (cleaned.length() < 1 || cleaned.length() > 100) {
            throw new BadRequestException("Skill name must be between 1 and 100 characters");
        }
        return cleaned;
    }

    public static String normalizeEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new BadRequestException("Email must not be blank");
        }
        return email.trim().toLowerCase();
    }
}
