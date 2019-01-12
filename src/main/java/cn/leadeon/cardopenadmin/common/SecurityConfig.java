package cn.leadeon.cardopenadmin.common;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.httpBasic()
                .and()
                .sessionManagement().invalidSessionUrl("/login.html")
                .and()
                .authorizeRequests().antMatchers("/**","/static/**").permitAll().anyRequest().authenticated()
                .and()
                .formLogin().loginPage("/login.html").defaultSuccessUrl("/index.html").permitAll()
                .and()
                .logout().permitAll()
                .and()
                .csrf().disable().headers().defaultsDisabled().cacheControl();
    }
}