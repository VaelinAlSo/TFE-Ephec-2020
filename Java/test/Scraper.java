package scraper;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;

public class Scraper {

	public static void main(String[] args) throws Exception {
		// TODO Auto-generated method stub
		final Document document = Jsoup
				.connect("https://www.boxofficemojo.com/title/tt0167260/credits/?ref_=bo_tt_tab#tabs").get();
		System.out.println(document.outerHtml());
			
		}
		
	}


