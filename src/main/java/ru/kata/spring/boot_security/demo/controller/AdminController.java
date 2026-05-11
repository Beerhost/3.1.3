package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.util.Set;

@Controller
@RequestMapping("/admin")
public class AdminController {

    private final UserService userService;

    @Autowired
    public AdminController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public String adminPage(@AuthenticationPrincipal User user, Model model) {
        model.addAttribute("currentUser", user);
        model.addAttribute("roles", userService.findAllRoles());
        model.addAttribute("newUser", new User());
        return "admin";
    }

    @GetMapping("/users/list")
    public String getAllUsers(Model model) {
        model.addAttribute("users", userService.findAll());
        model.addAttribute("roles", userService.findAllRoles());
        model.addAttribute("newUser", new User());
        return "users";
    }

    @PostMapping("/users/create")
    public String createUser(@ModelAttribute("newUser") User user,
                             @RequestParam(value = "roles", required = false) Set<Long> roleIds) {
        userService.createUserWithRoles(user, roleIds);
        return "redirect:/admin/users/list";
    }

    @GetMapping("/users/edit/{id}")
    public String editUserForm(@PathVariable Long id, Model model) {
        User user = userService.findById(id);
        model.addAttribute("user", user);
        model.addAttribute("allRoles", userService.findAllRoles());
        return "edit-user";
    }

    @PostMapping("/users/update/{id}")
    public String updateUser(@PathVariable Long id,
                             @RequestParam String username,
                             @RequestParam String email,
                             @RequestParam(value = "password", required = false) String newPassword,
                             @RequestParam(value = "roles", required = false) Set<Long> roleIds) {

        userService.updateUserWithRoles(id, username, email, newPassword, roleIds);
        return "redirect:/admin/users/list";
    }

    @PostMapping("/users/delete/{id}")
    public String deleteUser(@PathVariable Long id) {
        userService.deleteById(id);
        return "redirect:/admin/users/list";
    }
}