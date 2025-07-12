using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClothingStore.Models
{
    [Table("cities")]
    public class City
    {
        [Column("id")]
        public long Id { get; set; }
        
        [Column("name")]
        [Required]
        public string Name { get; set; } = string.Empty;
        
        [Column("state_id")]
        [Required]
        public long StateId { get; set; }
    }
}