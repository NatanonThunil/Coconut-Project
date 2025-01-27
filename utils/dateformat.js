import { useI18n } from 'vue-i18n';  // Make sure to import the useI18n if you are using Vue I18n

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return 'Invalid Date';

    const MonthsInThai = [
        'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
        'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];

    const MonthsInEnglish = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const { locale } = useI18n();

    
    let month = "";
    let year = date.getFullYear();
    const day = date.getDate();


    if (locale.value === "th") {
        month = MonthsInThai[date.getMonth()];
        year = date.getFullYear() + 543;  
    } else {
        month = MonthsInEnglish[date.getMonth()];
    }

    return `${day} ${month} ${year}`;
};
