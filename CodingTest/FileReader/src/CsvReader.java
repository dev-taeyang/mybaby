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
                String[] arr = line.split(",");
                List<String> rowData = new ArrayList<>();
                for (int i = 0; i < arr.length; i++) {
                    // 4번째 인덱스(0부터 시작하므로 3)는 빼고 나머지 데이터만 저장
                    if (i != 3) {
                        rowData.add(arr[i]);
                    }
                }
                ret.add(rowData);
            }

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

        // 입차시간을 기준으로 데이터를 정렬 (첫 번째 인덱스가 입차시간임을 가정)
        ret.sort(Comparator.comparing((List<String> list) -> list.get(1)));

        return ret;
    }

}

class ParkingFeeCalculator {
    // 주차 요금 계산을 위한 상수 정의
    private static final int MAX_MINUTES_FREE = 3;
    private static final int MAX_MINUTES_MINIMUM_CHARGE = 10;
    private static final int MINIMUM_CHARGE = 1000;
    private static final int PERIOD = 5;
    private static final int HOURLY_RATE = 500;
    private static final int MAX_FEE = 36000;

    // 주차 요금을 계산하는 메서드
    public int calculateFee(String entryTimeStr, String exitTimeStr) {
        LocalDateTime entryTime = LocalDateTime.parse(entryTimeStr, DateTimeFormatter.ofPattern("yyyy-MM-dd H:mm"));
        LocalDateTime exitTime = LocalDateTime.parse(exitTimeStr, DateTimeFormatter.ofPattern("yyyy-MM-dd H:mm"));

        long minutes = entryTime.until(exitTime, java.time.temporal.ChronoUnit.MINUTES); // 입차시간과 출차시간의 차이를 분 단위로 계산

        // 3분 이하 무료
        if (minutes <= MAX_MINUTES_FREE) {
            return 0;
        }

        // 최소 요금 1000원
        int fee = MINIMUM_CHARGE;

        // 10분 이하 요금 적용
        if (minutes <= MAX_MINUTES_MINIMUM_CHARGE) {
            return fee;
        }

        // 10분 초과 시간에 대해 5분당 요금 적용
        long additionalMinutes = minutes - MAX_MINUTES_MINIMUM_CHARGE;
        int additionalFee = (int) Math.ceil((double) additionalMinutes / PERIOD) * HOURLY_RATE;

        // 총 요금 계산
        fee += additionalFee;

        // 최대 요금 36000원으로 제한
        return Math.min(fee, MAX_FEE);
    }
}

class Main {
    public static void main(String[] args) {
        String filePath = "C:\\Users\\User\\Desktop\\코딩\\project\\test\\test.csv";
        CsvReader csvReader = new CsvReader(filePath);
        List<List<String>> data = csvReader.readFile();

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
        // 데이터의 총 개수를 출력
        System.out.println("총 데이터 개수: " + data.size());
    }
}