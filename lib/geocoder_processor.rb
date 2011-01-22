require 'json'

module GeocoderProcessor
  def update_subdistrict_latlng(subdistrict)
    response = search_by_name("Hong Kong #{subdistrict.name_eng} District")
    subdistrict.update_latlog(response["results"][0]["geometry"]["location"])
  end
  
  def update_recycle_bin_latlng(recycle_bin)
    result_chinese   = search_by_chinese_name(recycle_bin)
    if result_chinese
      recycle_bin.update_latlog(response["results"][0]["geometry"]["location"])
    else
      result_english = search_by_english_name(recycle_bin)
      if result_english
        recycle_bin.update_latlog(response["results"][0]["geometry"]["location"])
      else
        p "[not found] chinese: #{recycle_bin.add}, english: #{recycle_bin.add_eng}"
      end
    end
  end

  def search_by_english_name(recycle_bin)
    search_by_name("#{recycle_bin.add_eng} #{recycle_bin.subdistrict.name_eng}")
  end

  def search_by_chinese_name(recycle_bin)
    search_by_name("#{recycle_bin.subdistrict.name}#{recycle_bin.add}")
  end

  def search_by_name(name)
    url = "http://maps.googleapis.com/maps/api/geocode/json?address=#{CGI.escape(name)}&region=hk&sensor=false"
    result = JSON.parse(open(url).read)
    result if result["status"] == "OK"
  end
end