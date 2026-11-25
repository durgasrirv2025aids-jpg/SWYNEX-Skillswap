package com.skillswap.security;

import com.skillswap.entity.Student;
import com.skillswap.enums.AccountStatus;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class CustomUserDetails implements UserDetails {

    private final Long id;
    private final String email;
    private final String password;
    private final String fullName;
    private final AccountStatus accountStatus;
    private final Collection<? extends GrantedAuthority> authorities;

    public CustomUserDetails(Student student) {
        this.id = student.getId();
        this.email = student.getEmail();
        this.password = student.getPassword();
        this.fullName = student.getFullName();
        this.accountStatus = student.getAccountStatus();
        this.authorities = List.of(new SimpleGrantedAuthority("ROLE_" + student.getRole().name()));
    }

    public Long getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public AccountStatus getAccountStatus() {
        return accountStatus;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return accountStatus != AccountStatus.DISABLED;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return accountStatus == AccountStatus.ACTIVE;
    }
}
