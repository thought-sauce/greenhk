class RecycleBin
  # include Mongoid::Document
  # 
  #  cache
  #    
  #  field :add, :type => String
  #  field :add_eng, :type => String
  #  field :lat, :type => BigDecimal
  #  field :long, :type => BigDecimal
  #  
  #  attr_accessible :add, :add_eng, :lat, :long
  #  
  #  validates_format_of :add_eng, :with => /[A-Za-z0-9,\-\(\)\.\s]*/
  #  
  #  referenced_in :subdistrict
  #  
  #  index :lat, :background => true
  #  index :long, :background => true
  #  index [:lat, :long], :background => true
end
