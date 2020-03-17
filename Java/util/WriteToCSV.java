package util;

import java.io.BufferedWriter;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.io.Writer;
import java.util.ArrayList;

import model.CrewMember;
import model.Film;

public class WriteToCSV {
	public static void writeToCSV(Film film)
    {
        try
        {
        	if(film.getBoxOfficeResult()!=null) {
        		
        	
            BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(
	   	              new FileOutputStream("C:\\Users\\Gilles\\Documents\\BAC IT 2019-2020\\TFE\\files\\filmsDataSet1.csv",true)));
           
            
                StringBuffer oneLine = new StringBuffer();
                oneLine.append(film.getName());
                oneLine.append(",");
                oneLine.append(film.getClassification());
                oneLine.append(",");
                oneLine.append(film.getDuration());
                oneLine.append(",");
                oneLine.append(film.getGenre());
                oneLine.append(",");
                oneLine.append(film.getStudio());
                oneLine.append(",");
                oneLine.append(film.getBudget());
                oneLine.append(",");
                oneLine.append(film.getBoxOfficeResult());
                oneLine.append(",");
                oneLine.append(film.getReleaseDate());
                oneLine.append(",");
                for (CrewMember crewMember : film.getCrewMembers()) {
                	if(!crewMember.getName().isEmpty()&&!crewMember.getRole().isEmpty()) {
                		oneLine.append(crewMember.toString());
    					oneLine.append(",");
                	}
					
				}
                for (String actor : film.getActors()) {
                	if(!actor.isEmpty()) {
                		oneLine.append(actor.toString());
    					oneLine.append(",");
                	}
					
				}
             
                bw.write(oneLine.toString());
                bw.newLine();
                
            
            bw.flush();
            bw.close();
        	}
        }
        catch (UnsupportedEncodingException e) {}
        catch (FileNotFoundException e){}
        catch (IOException e){}
    }
}
