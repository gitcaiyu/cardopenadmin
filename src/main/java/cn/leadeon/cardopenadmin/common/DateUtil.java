package cn.leadeon.cardopenadmin.common;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

/**
 * 日期工具类
 */
public class DateUtil {

    /**
     * 因SimpleDateFormat为线程不安全类型 要不定义为一般对象 定义为静态对象需要加线程锁
     */
    private static final ThreadLocal<SimpleDateFormat> simpleDateFormat = new ThreadLocal<SimpleDateFormat>() {
        @Override
        protected SimpleDateFormat initialValue() {
            // TODO Auto-generated method stub
            return new SimpleDateFormat();
        }

    };

    /**
     * 获取时间字符串
     *
     * @return yyyyMMddhhmmss
     */
    public static String getDateString() {
        simpleDateFormat.get().applyPattern("yyyyMMddhhmmss");
        String str = simpleDateFormat.get().format(new Date());
        return str;
    }

    public static String getDateString(String pattern) {
        simpleDateFormat.get().applyPattern(pattern);
        String str = simpleDateFormat.get().format(new Date());
        return str;
    }

    /**
     * 获取时间字符串
     *
     * @return yyyyMMddhhmmss
     */
    public static String YYYYMMDD() {
        simpleDateFormat.get().applyPattern("yyyyMMdd");
        String str = simpleDateFormat.get().format(new Date());
        return str;
    }

    /**
     *
     * 将日期转换成格式为yyyy-MM-dd hh:mm:ss的日期字符串
     *
     * @return yyyy-MM-dd hh:mm:ss
     */
    public static String formatFullDateToString(Date date) {
        simpleDateFormat.get().applyPattern("yyyy-MM-dd HH:mm:ss");
        String strDate = simpleDateFormat.get().format(new Date());
        return strDate;
    }

    /**
     * 获取前一天
     *
     * @return
     */
    public static String getLastDay() {
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DATE, -1); // 得到前一天
        Date date = calendar.getTime();
        simpleDateFormat.get().applyPattern("yyyy-MM-dd");
        return simpleDateFormat.get().format(date);
    }
}
