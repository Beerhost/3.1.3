package ru.kata.spring.boot_security.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.kata.spring.boot_security.demo.controller.dto.RoleDto;
import ru.kata.spring.boot_security.demo.controller.dto.UserDto;
import ru.kata.spring.boot_security.demo.controller.dto.UserRequest;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminRestController {
    private final UserService userService;

    public AdminRestController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    public List<UserDto> getAllUsers() {
        return userService.findAll().stream()
                .map(UserDto::fromUser)
                .collect(Collectors.toList());
    }

    @GetMapping("/users/{id}")
    public UserDto getUser(@PathVariable Long id) {
        return UserDto.fromUser(userService.findById(id));
    }

    @PostMapping("/users")
    public ResponseEntity<UserDto> createUser(@RequestBody UserRequest request) {
        User user = toUser(request);
        userService.createUserWithRoles(user, request.getRoles());
        return ResponseEntity.status(HttpStatus.CREATED).body(UserDto.fromUser(user));
    }

    @PutMapping("/users/{id}")
    public UserDto updateUser(@PathVariable Long id, @RequestBody UserRequest request) {
        userService.updateUserWithRoles(
                id,
                request.getFirstName(),
                request.getLastName(),
                request.getAge(),
                request.getEmail(),
                request.getPassword(),
                request.getRoles()
        );
        return UserDto.fromUser(userService.findById(id));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/roles")
    public List<RoleDto> getAllRoles() {
        return userService.findAllRoles().stream()
                .map(RoleDto::fromRole)
                .collect(Collectors.toList());
    }

    private User toUser(UserRequest request) {
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setAge(request.getAge());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        return user;
    }
}
