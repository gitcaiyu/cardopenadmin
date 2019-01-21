package cn.leadeon.cardopenadmin;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

@SpringBootApplication(scanBasePackages = {"cn.leadeon"})
@MapperScan("cn.leadeon.cardopenadmin.mapper")
@ServletComponentScan
@EnableWebSecurity
@EnableScheduling
public class CardopenadminApplication {

    public static void main(String[] args) {
        SpringApplication.run(CardopenadminApplication.class, args);
    }
}
