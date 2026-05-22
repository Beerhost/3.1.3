package ru.kata.spring.boot_security.demo.controller.dto;

import ru.kata.spring.boot_security.demo.model.Role;

public class RoleDto {
    private Long id;
    private String name;

    public RoleDto() {
    }

    public RoleDto(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    public static RoleDto fromRole(Role role) {
        return new RoleDto(role.getId(), role.getName());
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
