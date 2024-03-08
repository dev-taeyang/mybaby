import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class CsvReader {
    private String filePath;

    public CsvReader(String filePath) {
        this.filePath = filePath;
    }

    // CSV 파일을 읽어와서 데이터를 반환하는 메서드
    public List<List<String>> readFile() {
        List<List<String>> ret = new ArrayList<>();
        BufferedReader br = null;

        try {
            br = Files.newBufferedReader(Paths.get(filePath), Charset.forName("UTF-8"));
            String line = "";

            // CSV 파일의 각 줄을 읽어서 리스트에 저장
            while ((line = br.readLine()) != null) {
                // , 로 분리하여 arr에 저장
                String[] arr = line.split(",");
                List<String> rowData = new ArrayList<>();
                for (int i = 0; i < arr.length; i++) {
                    // 4번째 인덱스(0부터 시작하므로 3)는 빼고 나머지 데이터만 저장 (csv 파일에 주차금액을 제외시키기)
                    if (i != 3) {
                        rowData.add(arr[i]);
                    }
                }
                // ret에 추출한 rowData를 arrayList로 저장
                ret.add(rowData);
            }

            //  exception 잡아줌
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                if (br != null) {
                    br.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        // 입차시간을 기준으로 데이터를 정렬
        ret.sort(Comparator.comparing((List<String> list) -> list.get(1)));

        return ret;
    }

}

class ParkingFeeCalculator {
    // 주차 요금 계산을 위한 상수 정의
    private static final int FREE_TIME = 3;
    private static final int MINIMUM_CHARGE_TIME = 10;
    private static final int MINIMUM_CHARGE_FEE = 1000;
    private static final int PERIOD = 5;
    private static final int MINUTES_FEE = 500;
    private static final int MAX_FEE = 36000;

    // 주차 요금을 계산하는 메서드
    public int calculateFee(String entryTimeStr, String exitTimeStr) {
        // 입차 시간
        LocalDateTime entryTime = LocalDateTime.parse(entryTimeStr, DateTimeFormatter.ofPattern("yyyy-MM-dd H:mm"));
        // 출차시간
        LocalDateTime exitTime = LocalDateTime.parse(exitTimeStr, DateTimeFormatter.ofPattern("yyyy-MM-dd H:mm"));

        long time = entryTime.until(exitTime, java.time.temporal.ChronoUnit.MINUTES); // 입차시간과 출차시간의 차이를 분 단위로 계산

        // 3분 이하 무료
        if (time <= FREE_TIME) {
            return 0;
        }

        // 최소 요금 1000원
        int fee = MINIMUM_CHARGE_FEE;

        // 10분 이하 요금 적용
        if (time <= MINIMUM_CHARGE_TIME) {
            return fee;
        }

        // 10분 초과 시간에 대해 5분당 요금 적용
        long additionalMinutes = time - MINIMUM_CHARGE_TIME;
        int additionalFee = (int) Math.ceil((double) additionalMinutes / PERIOD) * MINUTES_FEE;

        // 총 요금 계산
        fee += additionalFee;

        // 최대 요금 36000원으로 제한
        return Math.min(fee, MAX_FEE);
    }
}

class Main {
    public static void main(String[] args) {
        // CSV파일 절대 경로
        String filePath = "C:\\Users\\User\\Desktop\\코딩\\project\\test\\test.csv";

        // CSV 파일읽어주는 class 선언
        CsvReader csvReader = new CsvReader(filePath);

        // readFile 메소드 사용하여 불러온 값 저장 
        List<List<String>> data = csvReader.readFile();

        // 주차요금 계산 class 선언
        ParkingFeeCalculator parkingFeeCalculator = new ParkingFeeCalculator();

        // 주차 요금 계산 및 출력
        for (List<String> row : data) {
            String entryTime = row.get(1);
            String exitTime = row.get(2);
            int fee = parkingFeeCalculator.calculateFee(entryTime, exitTime);
            // 차량번호, 입차시간, 출차시간, 주차요금을 출력
            System.out.println(
                    "차량번호: " + row.get(0) + ", 입차시간: " + row.get(1) + ", 출차시간: " + row.get(2) + ", 주차요금: " + fee + "원");
        }
        // 데이터의 총 개수 확인을 위해 출력
        System.out.println("총 데이터 개수: " + data.size());
    }
}