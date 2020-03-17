package test;

import static org.junit.Assert.assertTrue;

import java.io.IOException;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

public class Scraper {

	public static void main(String[] args) throws Exception {
		// TODO Auto-generated method stub
		final Document document = Jsoup
				.connect("https://www.boxofficemojo.com/title/tt0167260/credits/?ref_=bo_tt_tab#tabs").get();
		System.out.println(document.outerHtml());
			
		}
		
	}


