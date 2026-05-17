package ru.kata.spring.boot_security.demo.service;
import org.springframework.security.core.userdetails.UserDetailsService;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;
import java.util.Set;
public interface UserService extends UserDetailsService {
    User findByUsername(String username);
    List<User> findAll();
    User findById(Long id);
    User save(User user);
    void deleteById(Long id);
    List<Role> findAllRoles();
    Role findRoleById(Long id);

    void updateUserWithRoles(Long id, String firstName, String lastName, Integer age,
                             String email, String newPassword, Set<Long> roleIds);

    void createUserWithRoles(User user, Set<Long> roleIds);
}
