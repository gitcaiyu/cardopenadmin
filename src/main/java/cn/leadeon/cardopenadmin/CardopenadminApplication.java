package cn.leadeon.cardopenadmin;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {"cn.leadeon"})
@MapperScan("cn.leadeon.cardopenadmin.mapper")
public class CardopenadminApplication {

    public static void main(String[] args) {
        SpringApplication.run(CardopenadminApplication.class, args);
    }
}
