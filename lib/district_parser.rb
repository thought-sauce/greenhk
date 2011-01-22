require 'open-uri'

module DistrictParser
  def self.parse(district, file_name) 
    if district
      file = File.new(file_name, "r")
        header_line_1 = file.gets.strip
        header_line_2 = file.gets.strip
        subdistrict = district.subdistricts.create!(:name => header_line_1, :name_eng => header_line_2)
      
        while (line = file.gets)
          if !line.blank?
            name_chin = line.strip
            name_eng = file.gets.strip
            subdistrict.recycle_bins.create!(:add => name_chin, :add_eng => name_eng)
          end
        end
      file.close
    end
  end
end