package cn.leadeon.cardopenadmin.filter;

import lombok.extern.slf4j.Slf4j;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.IOException;

/**
 * 过滤器，控制session过期
 */
@Slf4j
@WebFilter
public class SessionFilter implements Filter {

    public void doFilter(ServletRequest request, ServletResponse response,
                         FilterChain chain) throws IOException, ServletException {

        HttpServletRequest httpRequest = ((HttpServletRequest) request);
        String url = httpRequest.getRequestURI();
        int index = url.lastIndexOf("/");
        url = url.substring(index + 1);
        index = url.lastIndexOf(".");
        String filefix = url.substring(index + 1);

        String doMain = httpRequest.getContextPath();
        if (filefix.equalsIgnoreCase("js") || filefix.equalsIgnoreCase("jpg")
                || filefix.equalsIgnoreCase("css")
                || filefix.equalsIgnoreCase("png")
                || filefix.equalsIgnoreCase("gif")
                || filefix.equalsIgnoreCase("json")
                || filefix.equalsIgnoreCase("ico")
                || filefix.equalsIgnoreCase("htm")
                || filefix.equalsIgnoreCase("html")) {
            chain.doFilter(request, response);
            return;

        } else {
            if (!url.equalsIgnoreCase("login.html")
                    && !url.equalsIgnoreCase("login")) {

                if (!url.equalsIgnoreCase("userLogin")) {

                    HttpSession session = httpRequest.getSession();
                    Object entity = session.getAttribute("userInfo");
                    if (entity == null) {
                        String fullUrl = httpRequest.getRequestURL().toString();
                        int subIndex = fullUrl.indexOf(doMain);
                        fullUrl = fullUrl.substring(0,
                                subIndex + doMain.length());
                        log.info("session is null!the request url is" + fullUrl);

                        request.getRequestDispatcher("/login.html")
                                .forward(request, response);
                        return;
                    }
                }
            }

        }
        chain.doFilter(request, response);
    }

}
