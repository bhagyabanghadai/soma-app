import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ExternalLink, Heart, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NasaApodData {
  date: string;
  explanation: string;
  hdurl?: string;
  media_type: "image" | "video";
  service_version: string;
  title: string;
  url: string;
}

const NasaMedia = () => {
  const [apodData, setApodData] = useState<NasaApodData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchApodData = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiKey = import.meta.env.VITE_NASA_API_KEY || "DEMO_KEY";
        const response = await fetch(
          `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`
        );

        if (!response.ok) {
          throw new Error(`NASA API Error: ${response.status}`);
        }

        const data: NasaApodData = await response.json();
        setApodData(data);
      } catch (err) {
        console.error("Error fetching NASA APOD data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch NASA data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApodData();
  }, []);

  const handleSaveAsFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite
        ? "Removed from your saved NASA images"
        : "Saved to your NASA favorites collection",
    });
  };

  const handleViewOnNasa = () => {
    window.open("https://apod.nasa.gov/apod/", "_blank");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-soma-grey py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-soma-green animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading NASA's featured content...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-soma-grey py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-bold text-red-800 mb-2">
                Unable to load NASA content
              </h2>
              <p className="text-red-600 mb-4">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!apodData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            NASA Featured Insight
          </h1>
          <div className="flex items-center justify-center space-x-2 text-blue-200">
            <Info className="w-4 h-4" />
            <p className="text-sm">
              Daily content from NASA's public science feed
            </p>
          </div>
        </div>

        {/* Main Content Card */}
        <Card className="bg-black/40 border-gray-700 backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-bold text-white mb-2">
              {apodData.title}
            </CardTitle>
            <p className="text-blue-200 text-lg">
              {formatDate(apodData.date)}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Media Content */}
            <div className="relative">
              {apodData.media_type === "image" ? (
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src={apodData.hdurl || apodData.url}
                    alt={apodData.title}
                    className="w-full h-auto max-h-[600px] object-cover rounded-lg shadow-2xl"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-lg" />
                </div>
              ) : (
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <iframe
                    src={apodData.url}
                    title={apodData.title}
                    className="w-full h-full rounded-lg"
                    allowFullScreen
                    frameBorder="0"
                  />
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-gray-900/50 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-white mb-4">
                About Today's Feature
              </h3>
              <p className="text-gray-200 leading-relaxed text-base">
                {apodData.explanation}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                onClick={handleSaveAsFavorite}
                variant={isFavorite ? "default" : "outline"}
                className={`${
                  isFavorite
                    ? "bg-soma-green hover:bg-green-600 text-white"
                    : "border-gray-600 text-white hover:bg-gray-800"
                }`}
              >
                <Heart
                  className={`w-4 h-4 mr-2 ${
                    isFavorite ? "fill-current" : ""
                  }`}
                />
                {isFavorite ? "Favorited" : "Save as Favorite"}
              </Button>

              <Button
                onClick={handleViewOnNasa}
                variant="outline"
                className="border-blue-500 text-blue-300 hover:bg-blue-900/50"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View on NASA
              </Button>
            </div>

            {/* Footer */}
            <div className="text-center pt-4 border-t border-gray-700">
              <p className="text-gray-400 text-sm">
                Data provided by NASA's Astronomy Picture of the Day API
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NasaMedia;