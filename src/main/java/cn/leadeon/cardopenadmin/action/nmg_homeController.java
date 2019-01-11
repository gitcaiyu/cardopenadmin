package cn.leadeon.cardopenadmin.action;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@CrossOrigin
public class nmg_homeController {

    @GetMapping(value = "/login")
    public String index() {
        return "login.html";
    }

}
