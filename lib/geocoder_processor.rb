module GeocoderProcessor
  def multiple_dimension_search(recycle_bin)
    result_chinese   = search_by_chinese_name(recycle_bin.add)
    if result_chinese
      save_latlog(recycle_bin, result_chinese) 
    else  
      result_english   = search_by_english_name(recycle_bin.add_eng)
      if result_english
        save_latlog(recycle_bin, result_english)
      else
        found = recycle_bin.add.index("號")
        if found
          result_substring = search_by_chinese_name(recycle_bin.add[0, found + 3]) 
          if result_substring
            save_latlog(recycle_bin, result_substring) 
          else
          p "not found even having  號 #{recycle_bin.add}"
          end
        else
          p "not found pattern of 號 #{recycle_bin.add}"
        end
      end
    end
  end

  def save_latlog(recycle_bin, result)
    coordinates = result["Placemark"][0]["Point"]["coordinates"]
    recycle_bin.lat = coordinates[0]
    recycle_bin.long = coordinates[1]
    recycle_bin.save!
  end

  def search_by_english_name(name)
    search_by_name("Hong Kong " + name)
  end

  def search_by_chinese_name(name)
    search_by_name("香港" + name)
  end

  def search_by_name(name)
    api_key = GOOGLE_MAP_API_KEY
    url = "http://maps.google.com.hk/maps/geo?q=#{CGI.escape(name)}&output=json&key=#{api_key}"
    result = JSON.parse(open(url).read)
    result if result["Status"]["code"] == 200
  end
end