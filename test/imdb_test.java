package test;	
	import java.awt.List;
	import java.io.BufferedWriter;
	import java.io.FileNotFoundException;
	import java.io.FileOutputStream;
	import java.io.IOException;
	import java.io.OutputStreamWriter;
	import java.io.UnsupportedEncodingException;
	import java.io.Writer;
	import java.util.ArrayList;
	import java.util.Random;

	import org.openqa.selenium.By;
	import org.openqa.selenium.JavascriptExecutor;
	import org.openqa.selenium.WebDriver;
	import org.openqa.selenium.WebElement;
	import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
	import org.openqa.selenium.support.ui.Select;
	import org.openqa.selenium.support.ui.WebDriverWait;
public class imdb_test {
	

	
		
	    public static void main(String[] args) {
	    	
	    	
	    		
	    	
	    	System.setProperty("webdriver.chrome.driver","C:\\Users\\Gilles\\chromedriver.exe");
	    	
	    	
	    	String proxy = "127.0.0.1:5000";
	    	ChromeOptions options = new ChromeOptions();
	    //	options.AddUserProfilePreference("profile.default_content_setting_values.images", 2);
	    	WebDriver driver = new ChromeDriver(options);

	        String baseUrl = "https://www.boxofficemojo.com/year/world/?ref_=bo_nb_ydw_tab";
	        String tagName = "";
	        WebDriverWait myWaitVar = new WebDriverWait(driver, 12);
	        WebElement filmElement;
	        String budget = "";
	        String result = "";
	        
	        driver.get(baseUrl);
	        driver.findElement(By.id("a-autoid-0-announce")).click();
	        try{
				Thread.sleep(2000);
				}
				catch(InterruptedException ie){
				}
	        driver.findElement(By.id("year-navSelector_17")).click();
	        try{
				Thread.sleep(5000);
				}
				catch(InterruptedException ie){
				}
	      driver.findElement(By.xpath("//*[@id=\"table\"]/div/table[2]/tbody/tr[2]/td[2]/a")).click();
	      try{
				Thread.sleep(2000);
				}
				catch(InterruptedException ie){
				}
	      driver.findElement(By.id("title-summary-refiner")).click();
	     budget = driver.findElement(By.xpath("//*[@id=\"a-page\"]/main/div/div[3]/div[4]/div[3]/span[2]/span")).getText();
	     result = driver.findElement(By.xpath("//*[@id=\"a-page\"]/main/div/div[3]/div[1]/div/div[3]/span[2]/span")).getText();
	     System.out.println("Budget : "+budget +" ");
	     System.out.println("Box office result : "+result +" ");
	        
	        /*
	        	 try (Writer writer = new BufferedWriter(new OutputStreamWriter(
	   	              new FileOutputStream("C:\\Users\\Gilles\\Desktop\\Cryptos_report\\crypto13_3_19.txt"), "utf-8"))) {
	   	   writer.write(e2);
	   	} catch (UnsupportedEncodingException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			} catch (FileNotFoundException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			} catch (IOException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
	            
	        }
	    
	       */
	               
	    	
	        driver.close();
	        System.exit(0);
	    	
	}
	}

