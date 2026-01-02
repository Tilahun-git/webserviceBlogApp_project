package com.blogApplication.blogApp.payloads;

public enum UserStatus {
    ACTIVE,
    INACTIVE,
    DELETED;


    public boolean equalsIgnoreCase(UserStatus userStatus) {
        return this == userStatus;
    }
}
