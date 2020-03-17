package test;

import java.io.*;

public class FileReaderByLine {
	public static void main(String args[]) {
	//	System.setProperty("https.proxyHost", "51.68.61.17");
        
        //set HTTP proxy port to 3128
      //  System.setProperty("https.proxyPort", "443");
		try {
			File file = new File("C:\\Users\\Gilles\\Documents\\BAC IT 2019-2020\\TFE\\files\\data.tsv"); // creates a new file instance
			FileReader fr = new FileReader(file); // reads the file
			BufferedReader br = new BufferedReader(fr); // creates a buffering character input stream
			StringBuffer sb = new StringBuffer(); // constructs a string buffer with no characters
			String line;
			int iteration = 0;
			int count =0;
			BoxOffMojoScraper boxOffMojoScraper = new BoxOffMojoScraper();
			boolean canRead = false;
			while ((line = br.readLine()) != null) {
				if(iteration == 0) {
					iteration++;
					continue;
				}
				
				String[] lineSplitted = line.split("\\t");
				if(lineSplitted[5].toString().contains("N")) {
					continue;
				}
				int yearOfRelease = Integer.parseInt(lineSplitted[5]);
				if(lineSplitted[1].toString().contains("movie")&&yearOfRelease>1976&&yearOfRelease<2019) {
				//if(yearOfRelease>1976&&yearOfRelease<1980) {
				
				//sb.append(lineSplitted[0].toString());// appends line to string buffer
				//sb.append(" ");
				//sb.append(lineSplitted[2].toString());
				//sb.append("\n"); // line feed
					if(lineSplitted[0]=="tt0078453") {
						canRead =true;
					}
					if(canRead) {
						boxOffMojoScraper.getMovieData(lineSplitted[0]);
					}
				
				
				if(count >100) {
					count=0;
					try {
						Thread.sleep(100);
					} catch (InterruptedException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				count++;
				}
				
			}
			fr.close(); // closes the stream and release the resources
			/*
			try (Writer writer = new BufferedWriter(new OutputStreamWriter(
	   	              new FileOutputStream("C:\\Users\\Gilles\\Documents\\BAC IT 2019-2020\\TFE\\files\\films76_2019_10.txt"), "utf-8"))) {
	   	   writer.write(sb.toString());
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
			*/
		} catch (IOException e) {
			e.printStackTrace();
		}
		
	}
	
	

	
}




