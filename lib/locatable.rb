module Locatable
  def self.included(klass)
    klass.class_eval do
      field :lat, :type => BigDecimal
      field :lng, :type => BigDecimal
      
      attr_accessible :lat, :lng

      # index :lat, :background => true
      # index :long, :background => true
      # index [:lat, :long], :background => true
      
      def update_latlog(coordinates)
        self.lat = coordinates["lat"]
        self.lng = coordinates["lng"]
        self.save!
      end
    end
  end
end